import * as R from 'rambda';
import * as React from 'react';
import { asPlayerImage, IPlayerState, IProfilesState } from '../models/client';
import { MAX_HP } from '../models/constants';

const Profile: React.StatelessComponent<{ profile: IPlayerState }> = ({
  profile,
}) => (
  <div className="Profile">
    <span className="Hp">
      <span style={{ width: `${(profile.hp / MAX_HP) * 100}%` }} />
    </span>
    <img src={asPlayerImage(profile.asset)} />
    <span>{`${profile.name} / ${profile.money}`}</span>
  </div>
);

export const Profiles: React.SFC<{ profiles: IProfilesState }> = ({
  profiles,
}) => (
  <div className="Profiles">
    {profiles.me && <Profile profile={profiles.me} />}
    {R.range(0, Math.min(13, profiles.others.length))
      .map(index => profiles.others[index])
      .filter(each => each.hp > 0)
      .map(each => (
        <Profile key={each.id} profile={each} />
      ))}
    <div style={{ clear: 'both' }} />
  </div>
);
