import { commissionData } from '#data/CommissionData'
import Image from 'next/image'
import IllustratorInfo from './illustrator-info'
import { CommissionInfoProps } from './types'

interface Props {
  Character: string
}

const Listing = ({ Character }: Props) => {
  const lowercaseCharacter = Character.toLowerCase()
  const commissions = Object.values(commissionData)
    .filter(commission => commission.Character.toLowerCase() === lowercaseCharacter)
    .map(commission => ({
      ...commission,
      PublishDate: commission.fileName.slice(0, 8),
      Creator: commission.fileName.split('_')[1],
    }))
    .sort((a, b) => b.PublishDate.localeCompare(a.PublishDate))

  if (commissions.length === 0) {
    return <p>To be announced ...</p>
  }

  return (
    <>
      {commissions.map((commission: CommissionInfoProps) => (
        <div key={`${commission.Creator}-${commission.PublishDate}`}>
          <Image
            src={require(`data/commission/images/${commission.Character}/${commission.fileName}.jpg`)}
            alt={`${commission.Creator} ©️ ${commission.PublishDate}`}
            quality={95}
            placeholder="blur"
          />
          <IllustratorInfo {...commission} />
        </div>
      ))}
    </>
  )
}

export default Listing
