import { Props } from 'CommissionDataProps'

// Active
import { AZKi } from '#data/commission/AZKi'
import { Lucia } from '#data/commission/Lucia'
import { Ina } from '#data/commission/Ina'

// Stale
import { Nishe } from '#data/commission/stale/Nishe'
import { Tkmt } from '#data/commission/stale/Tkmt'

export const commissionData: Props[] = [
  //Active Data
  ...AZKi,
  ...Ina,
  ...Lucia,

  //Stale Data
  ...Nishe,
  ...Tkmt
]
