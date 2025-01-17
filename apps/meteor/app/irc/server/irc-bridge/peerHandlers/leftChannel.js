import { Users, Rooms } from '../../../../models/server';
import { removeUserFromRoom } from '../../../../lib/server';

export default function handleLeftChannel(args) {
	const user = Users.findOne({
		'profile.irc.nick': args.nick,
	});

	if (!user) {
		throw new Error(`Could not find a user with nick ${args.nick}`);
	}

	const room = Rooms.findOneByName(args.roomName);

	if (!room) {
		throw new Error(`Could not find a room with name ${args.roomName}`);
	}

	this.log(`${user.username} left room ${room.name}`);
	Promise.await(removeUserFromRoom(room._id, user));
}
