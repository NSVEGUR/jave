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
