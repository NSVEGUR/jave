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
