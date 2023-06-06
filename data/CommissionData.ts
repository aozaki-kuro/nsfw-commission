import { Props } from '#data/types'

// Active
import { AZKi } from '#data/commission/AZKi'
import { Lucia } from '#data/commission/Lucia'
import { Ina } from '#data/commission/Ina'

// Misc
import { Misc } from './commission/Misc'

// Stale
import { Nishe } from '#data/commission/stale/Nishe'
import { Tkmt } from '#data/commission/stale/Tkmt'

export const commissionData: Props[] = [
  //Active Data
  ...AZKi,
  ...Ina,
  ...Lucia,

  // Misc
  ...Misc,

  //Stale Data
  ...Nishe,
  ...Tkmt
]
