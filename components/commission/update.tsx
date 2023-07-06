import { charaDictionary } from '#data/CharaDictionary'
import { commissionData } from '#data/CommissionData'
import Link from 'next/link'

type LatestEntry = {
  fileName: string
  Character: string
}

const kebabCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[\W_]+/g, '-')

const Update = () => {
  const latestEntry = Object.values(commissionData).reduce(
    (latest: LatestEntry | null, { fileName, Character }) => {
      const publishDateInt = parseInt(fileName.substring(0, 8))

      if (isNaN(publishDateInt)) return latest

      if (!latest || latest.fileName < fileName) {
        return { fileName, Character }
      }

      return latest
    },
    null,
  )

  if (!latestEntry) {
    return <p className="font-mono text-sm">No updates found</p>
  }

  const formattedDate = `${latestEntry.fileName.substring(0, 4)}/${latestEntry.fileName.substring(
    4,
    6,
  )}/${latestEntry.fileName.substring(6, 8)}`
  const { Character } = latestEntry
  const dictionaryEntry = charaDictionary.filter(chara => chara.Abbr === Character)[0]
  const fullName = dictionaryEntry?.FullName ?? Character.toLowerCase()

  return (
    <div className="flex flex-auto font-mono text-sm ss:text-xs">
      <p className="pr-2">Last update:</p>
      <p className="pr-2" suppressHydrationWarning={true}>
        {formattedDate}
      </p>
      <p className="">
        [{' '}
        <Link href={`#${kebabCase(fullName)}`} className="underline-offset-[0.2rem]">
          {fullName}
        </Link>{' '}
        ]
      </p>
    </div>
  )
}

export default Update
