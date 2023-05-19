import Image from 'next/image'
import IllustratorInfo from './illustrator-info'
import { commissionData } from '#data/CommissionData'
import type { CommissionInfoProps } from 'CommissionInfoProps'

interface Props {
  Character: string
}

const renderCommission = (commission: CommissionInfoProps) => (
  <div key={`${commission.Creator}-${commission.PublishDate}`}>
    <Image
      src={require(`public/images/${commission.Character}/${commission.fileName}.jpg`)}
      alt={`${commission.Creator} ©️ ${commission.PublishDate}`}
      quality={95}
      placeholder="blur"
    />
    {/* Displaying the illustrator information using the IllustratorInfo component */}
    <IllustratorInfo {...commission} />
  </div>
)

const Listing = ({ Character }: Props) => {
  const lowercaseCharacter = Character.toLowerCase()

  const commissions = Object.values(commissionData)
    .filter(
      commission => commission.Character.toLowerCase() === lowercaseCharacter
    )
    .map(commission => ({
      ...commission,
      PublishDate: commission.fileName.slice(0, 8),
      Creator: commission.fileName.split('_')[1]
    }))
    .sort((a, b) => b.PublishDate.localeCompare(a.PublishDate))

  if (commissions.length === 0) {
    return <p>To be announced ...</p>
  }

  const newestCommissions = commissions.slice(0, 3)

  return (
    <>
      {newestCommissions.map(renderCommission)}
      {commissions.length > newestCommissions.length && (
        <details className="pt-8">
          <summary>Click to display more other works</summary>
          {commissions.slice(newestCommissions.length).map(renderCommission)}
        </details>
      )}
    </>
  )
}

export default Listing
