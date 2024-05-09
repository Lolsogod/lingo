type Count = {
	New: number;
	Learning: number;
	Review: number;
	Relearning: number;
};
type Book = {
	id?: number;
	spine: string[];
	toc: TableOfContentsItem[];
	file: File;
};

type Metadata = {
	id?: number;
	title: string;
	author: string[];
	cover: Blob | undefined;
	progress: number;
	length: number;
};

type TableOfContentsItem = {
	title: string;
	href: string;
	index: number;
	children?: TableOfContentsItem[];
};
