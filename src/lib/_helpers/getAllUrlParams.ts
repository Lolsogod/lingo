export default async function getAllUrlParams(url: string): Promise<object> {
	let paramsObj = {};
	try {
		const newUrl = url?.slice(1); //remove leading ?
		if (!newUrl) return {}; //if no params return
		paramsObj = await Object.fromEntries(await new URLSearchParams(newUrl));
	} catch (error) {
		console.log("error: ", error);
	}
	return paramsObj;
}
