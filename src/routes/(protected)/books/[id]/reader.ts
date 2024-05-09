import { relativeToAbs } from '$lib/book/read';
import type { ZipInfo } from 'unzipit';

const injectStyles = (styles: string[]) => {
	const fragment = document.createDocumentFragment();

	document.head.querySelectorAll('.lingo').forEach((styleE) => styleE.remove());

	styles.forEach((stylesheet) => {
		const styleE = document.createElement('style');
		styleE.innerText = nestCSSSelectors(stylesheet);
		styleE.className = 'lingo';
		fragment.appendChild(styleE);
	});

	document.head.appendChild(fragment);
};

const nestCSSSelectors = (css: string): string =>
	css.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, '#container $1$2');

const domParser = new DOMParser();

export const assembleChapter = async (
	chapterPath: string,
	entries: ZipInfo['entries'],
	jumpTo: (href: string) => void
): Promise<HTMLElement> => {
	const html = await entries[chapterPath].text();
	
	let newHTML = domParser.parseFromString(html, 'application/xhtml+xml');

	const errorNode = newHTML.querySelector('parsererror');
	if (errorNode) {
		newHTML = domParser.parseFromString(html, 'text/html');
	}

	const styles: string[] = [];
	for (const e of newHTML.head.querySelectorAll('link[rel="stylesheet"], style')) {
		if (e.tagName.toLowerCase() === 'link') {
			const href = e.getAttribute('href');
			if (!href) continue;
			const filename = relativeToAbs(href, chapterPath);
			styles.push(await entries[filename].text());
		} else {
			styles.push(e.innerHTML);
		}
	}
	injectStyles(styles);

	for (const e of newHTML.body.querySelectorAll('[src], svg image, a[href]')) {
		if (e.tagName.toLowerCase() === 'a') {
			const href = e.getAttribute('href');
			if (href && !href.includes('http')) {
				e.addEventListener('click', (event) => {
					event.preventDefault();
					const absHref = relativeToAbs(href, chapterPath);
					jumpTo(absHref); 
				});
			} else {
				e.setAttribute('target', '_blank'); 
			}
			continue;
		}

		const attribute = e.tagName.toLowerCase() === 'img' ? 'src' : 'xlink:href';
		const url = e.getAttribute(attribute);

		if (url && !url.includes('http')) {
			const filename = relativeToAbs(url, chapterPath);
			const blob = await entries[filename].blob();
			e.setAttribute(attribute, URL.createObjectURL(blob));

			// Fixes some SVGs not playing nicely
			if (e.parentElement?.tagName.toLowerCase() === 'svg') {
				e.parentElement?.setAttribute('height', 'auto');
				e.parentElement?.setAttribute('width', 'auto');
			}
		}
	}

	return newHTML.body;
};
