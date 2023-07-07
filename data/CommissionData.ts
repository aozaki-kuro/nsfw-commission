import { Props } from '#data/types'

// Active
import { AZKi } from '#data/commission/AZKi'
import { Ina } from '#data/commission/Ina'
import { Lucia } from '#data/commission/Lucia'

// Misc
import { Misc } from './commission/Misc'

// Stale
import { Nishe } from '#data/commission/stale/Nishe'
import { Tkmt } from '#data/commission/stale/Tkmt'
// import { nayuta } from './commission/Nayuta'

export const commissionData: Props[] = [
  //Active Data
  ...AZKi,
  ...Lucia,
  // ...nayuta,

  // Misc
  ...Misc,

  //Stale Data
  ...Ina,
  ...Nishe,
  ...Tkmt,
]
