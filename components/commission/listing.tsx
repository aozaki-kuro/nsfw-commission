import { commissionData } from '#data/CommissionData'
import Image from 'next/image'
import { useMemo } from 'react'
import IllustratorInfo from './illustrator-info'
import { CommissionInfoProps } from './types'

interface Props {
  Character: string
}

const renderCommission = (commission: CommissionInfoProps) => (
  <div key={`${commission.Creator}-${commission.PublishDate}`}>
    <Image
      src={require(`data/commission/images/${commission.Character}/${commission.fileName}.jpg`)}
      alt={`${commission.Creator} ©️ ${commission.PublishDate}`}
      quality={95}
      placeholder="blur"
    />
    <IllustratorInfo {...commission} />
  </div>
)

const Listing = ({ Character }: Props) => {
  const commissions = useMemo(() => {
    const lowercaseCharacter = Character.toLowerCase()
    return Object.values(commissionData)
      .filter(commission => commission.Character.toLowerCase() === lowercaseCharacter)
      .map(commission => {
        const [PublishDate, Creator] = commission.fileName.split('_')
        return { ...commission, PublishDate: PublishDate.slice(0, 8), Creator }
      })
      .sort((a, b) => b.PublishDate.localeCompare(a.PublishDate))
  }, [Character])

  if (commissions.length === 0) {
    return <p>To be announced ...</p>
  }

  return <>{commissions.map(renderCommission)}</>
}

export default Listing
