import { Meteor } from 'meteor/meteor';
import { DDPCommon } from 'meteor/ddp-common';
import { api } from '@rocket.chat/core-services';

import { NotificationsModule } from '../../../../server/modules/notifications/notifications.module';
import { Streamer } from '../../../../server/modules/streamer/streamer.module';
import './Presence';

class Stream extends Streamer {
	registerPublication(name: string, fn: (eventName: string, options: boolean | { useCollection?: boolean; args?: any }) => void): void {
		Meteor.publish(name, function (eventName, options) {
			return Promise.await(fn.call(this, eventName, options));
		});
	}

	registerMethod(methods: Record<string, (eventName: string, ...args: any[]) => any>): void {
		Meteor.methods(methods);
	}

	changedPayload(collection: string, id: string, fields: Record<string, any>): string | false {
		return DDPCommon.stringifyDDP({
			msg: 'changed',
			collection,
			id,
			fields,
		});
	}
}

const notifications = new NotificationsModule(Stream);

notifications.configure();

notifications.streamLocal.on('broadcast', ({ eventName, args }) => {
	api.broadcastLocal(eventName, ...args);
});

export default notifications;
