import type { RequestHandler } from './$types';
import { YoutubeTranscript } from 'youtube-transcript';

export const GET: RequestHandler = async ({ url }) => {
	const videoUrl = url.searchParams.get('v');
	if (!videoUrl) {
		return new Response('Missing videoUrl parameter', { status: 400 });
	}
	console.log(videoUrl);
	try {
		const transcript = await YoutubeTranscript.fetchTranscript(videoUrl, { lang: 'ja' });
		const srtContent = convertToSRT(transcript);
		console.log(srtContent);
	
		return new Response(srtContent, {
			headers: {
				'Content-Type': 'application/x-subrip',
				'Content-Disposition': 'attachment; filename="subtitles.srt"'
			}
		});
	} catch (error) {
		console.log(error);
		return new Response('Failed to fetch subtitles', { status: 500 });
	}
};

// Helper function to convert transcript to SRT format
function convertToSRT(transcript: any[]): string {
	return transcript
		.map((entry, index) => {
			const start = formatTime(entry.offset);
			const end = formatTime(entry.offset + entry.duration);
			const text = entry.text;

			return `${index + 1}\n${start} --> ${end}\n${text}\n`;
		})
		.join('\n');
}


function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = (seconds % 60).toFixed(3);

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(6, '0').replace('.', ',')}`;
}

/** const test = await fetch('https://subtitle.downsub.com/?title=%5BJapanese%20(auto-generated)%5D%20%E3%83%9A%E3%83%83%E3%83%91%E3%83%94%E3%83%83%E3%82%B0%20%7C%20Peppa%20Pig%20Japanese%20%7C%20%E3%83%97%E3%83%AC%E3%82%A4%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97%20%7C%20%E5%AD%90%E4%BE%9B%E5%90%91%E3%81%91%E3%82%A2%E3%83%8B%E3%83%A1%20%5BDownSub.com%5D&url=eyJjdCI6Im93bnlYVDQ1TVl4M3FidHNRNVMzU1g5TkxNRVM4bCsrN1BJdmg2bGxEa0poTk4xcVlSRkVCNlZBZDh4RkpMQVA2QUhRMjNpS2JNd0NxTldhbUNURnJZUTMzZWd1TVR6U283M2JvSnlXRXgxN1BEZlo3TGJGdDIyNFZWWTkxV2F1bHJZMFBsOGZlNGZmVFU1KzE1bFVhS2pKamFBSncvNURSVW52WmZxSTA2dzliN2h0V3FjeHVaSjlYUDU4R0RJNXJDMC96OEZYcXQ2Q3RUTG1ZZTVwL011VXd6Y3JONllSeFFRU2tISkVtMGpGSGdrRkI2SllLYnE5cnJqY0tCUXFtcTMzVFZrVnFVdDZEcTE1dHRoVm4venZsbzNsVEoxZkpVa3FQZ0xXNkhtS3dTdzYvczlDUi84UU95TVFHbWZEbjRhVDZMbnZuZVU2bnFQSlo1R3E4UlN2TWJVVXZWdHlTcWtRMzh1b2ZCM2QyUENsMGV6S3J3cDUzekRoZndCajZsQmZEbHptN01LTi9qaWFucnNNbjM1UENuMU1zeHVEZExETzVCMGlpc0tpVGxCYm1GVXRBWFVHL1dXeXFZcUYiLCJpdiI6IjQwNWM2MGFjZTAzZWY1ZDFkNmIzMmJmYTA1NmMxNDg5IiwicyI6ImFjNzZiZTQwNWZlZmMzMjYifQ=')
    return new Response(test.body, {headers: {
        'Content-Type': 'application/srt'
    }}); */
