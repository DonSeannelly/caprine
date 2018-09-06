'use strict';
const path = require('path');
const electron = require('electron');
const {sendAction} = require('./util');

const {app} = electron;
let tray = null;

exports.create = win => {
	if (process.platform === 'darwin' || tray) {
		return;
	}

	const iconPath = path.join(__dirname, 'static/IconTray.png');

	const toggleWin = () => {
		if (win.isVisible()) {
			win.hide();
		} else {
			win.show();
		}
	};

	const contextMenu = electron.Menu.buildFromTemplate([
		{
			label: 'Toggle',
			click() {
				toggleWin();
			}
		},
		{
			label: 'New Message',
			click() {
				win.focus();
				sendAction('new-conversation');
			}
		},
		{
			type: 'separator'
		},
		{
			role: 'quit'
		}
	]);

	tray = new electron.Tray(iconPath);
	tray.setToolTip(`${app.getName()}`);
	tray.setContextMenu(contextMenu);
	tray.on('click', toggleWin);
};

exports.setBadge = shouldDisplayUnread => {
	if (process.platform === 'darwin' || !tray) {
		return;
	}

	const icon = shouldDisplayUnread ? 'IconTrayUnread.png' : 'IconTray.png';
	const iconPath = path.join(__dirname, `static/${icon}`);
	tray.setImage(iconPath);
};
