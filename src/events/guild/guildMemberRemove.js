const { deleteDoc, doc, getDoc } = require('firebase/firestore');
const { ensureSignedIn, getDb } = require('../../utilities/functions/firebase');
const logger = require('../../utilities/functions/logger').child({ module: 'guildMemberRemove' });

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member) {
        try {
            await ensureSignedIn();

            const userRef = doc(getDb(), 'serverUsers', member.guild.id, 'users', member.user.id);
            const snapshot = await getDoc(userRef);
            if (!snapshot.exists()) return;

            await deleteDoc(userRef);
            logger.info('Deleted departing guild member from database', {
                guildId: member.guild.id,
                userId: member.user.id,
                username: member.user.username,
            });
        } catch (error) {
            logger.error('Failed to remove departing guild member from database', {
                error,
                guildId: member.guild.id,
                userId: member.user.id,
            });
        }
    },
};
