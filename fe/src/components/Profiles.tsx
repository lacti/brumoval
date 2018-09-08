import * as React from 'react';
import { MAX_HP } from '../models/constants';
import { IPlayerState, IProfilesState } from '../store/state';

const Profile: React.StatelessComponent<{ profile: IPlayerState }> = ({
  profile,
}) => (
  <div className="Profile">
    <span className="Hp">
      <span style={{ width: `${(profile.hp / MAX_HP) * 100}%` }} />
    </span>
    <img src={profile.asset as any} />
    <span>
      {profile.name}
      {profile.money ? ` / ${profile.money}` : ''}
    </span>
  </div>
);

export const Profiles: React.SFC<{ profiles: IProfilesState }> = ({
  profiles,
}) => (
  <div className="Profiles">
    {profiles.me && <Profile profile={profiles.me} />}
    {profiles.others.map(each => (
      <Profile key={each.name} profile={each} />
    ))}
    <div style={{ clear: 'both' }} />
  </div>
);
