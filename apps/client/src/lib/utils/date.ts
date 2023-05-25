export const timestampToDate = function (timestamp: number | string) {
	const date = new Date(timestamp);
	const currentDate = new Date();
	if (currentDate.getHours() - date.getHours() <= 24) {
		return `${date.toLocaleTimeString('en-In', {
			hour: '2-digit',
			minute: '2-digit'
		})}`;
	} else if (currentDate.getHours() - date.getHours() <= 48) {
		return 'Yesterday';
	}
	return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};

export const timestampToTimeAndDate = function (timestamp: number | string) {
	const date = new Date(timestamp);
	return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}, at ${date.getHours()}:${date.getMinutes()}`;
};

function padTo2Digits(num: number) {
	return num.toString().padStart(2, '0');
}

export const getHoursAndMinutes = function (date: Date) {
	return `${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}`;
};

export const getVideoDuration = function (currentTime: number, duration: number) {
	const currentDuration = `${padTo2Digits(Math.floor(currentTime / 60))}:${padTo2Digits(
		Math.floor(currentTime % 60)
	)}`;
	const totalDuration = `${padTo2Digits(Math.floor(duration / 60))}:${padTo2Digits(
		Math.floor(duration % 60)
	)}`;
	if (isNaN(Math.floor(duration / 60))) {
		return { currentDuration: '00:00', totalDuration: '00:00' };
	}
	return { currentDuration, totalDuration };
};
