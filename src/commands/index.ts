import { ban } from './ban';
import { debate } from './debate';
import { mute } from './mute';
import { ping } from './ping';
import { purge } from './purge';
import { selfRoleCreate } from './self-role-create';
import { selfRoleJoin } from './self-role-join';
import { tag } from './tag';
import { tagEdit } from './tag-edit';
import { tagList } from './tag-list';
import { unban } from './unban';
import { unmute } from './unmute';
import { unwarn } from './unwarn';
import { warn } from './warn';
import { warnList } from './warn-list';

export const commands = [
    ping,
    ban,
    unban,
    purge,
    mute,
    unmute,
    warn,
    warnList,
    tagEdit,
    tag,
    tagList,
    unwarn,
    debate,
    selfRoleCreate,
    selfRoleJoin
] as const;
