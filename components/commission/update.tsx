import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'

import { commissionData } from '#data/CommissionData'
import { charaDictionary } from '#data/CharaDictionary'

type LatestEntry = {
  fileName: string
  Character: string
}

const kebabCase = (str: string) =>
  str
    // Convert to lowercase and remove apostrophes
    .toLowerCase()
    .replace(/'/g, '')
    // Replace non-word characters with hyphens
    .replace(/[\W_]+/g, '-')

const Update = () => {
  let latestEntry: LatestEntry | null = null

  for (const [, { fileName, Character }] of Object.entries(commissionData)) {
    const publishDate = fileName.substring(0, 8)
    const publishDateInt = parseInt(publishDate)

    if (isNaN(publishDateInt)) continue

    if (!latestEntry || latestEntry.fileName < fileName) {
      latestEntry = { fileName, Character }
    }
  }

  if (!latestEntry) {
    return <p className="font-mono text-sm">No updates found</p>
  }

  const rawDate = latestEntry.fileName.substring(0, 8)
  const date = new Date(
    `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
  )

  const [formattedDate, setFormattedDate] = useState<string>(
    '\u2000'.repeat(4) + '/' + '\u2000'.repeat(2) + '/' + '\u2000'.repeat(2)
  )

  useEffect(() => {
    setFormattedDate(
      date?.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    )
  }, [])

  const { Character } = latestEntry
  const dictionaryEntry = charaDictionary.find(
    chara => chara.Abbr === Character
  )
  const fullName = dictionaryEntry
    ? dictionaryEntry.FullName
    : Character.toLowerCase()

  return (
    <Transition
      appear={true}
      show={true}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
    >
      <div className="flex flex-auto font-mono text-sm ss:text-xs">
        <p className="pr-2">Last update:</p>
        <p className="pr-2">{formattedDate}</p>
        <p className="">
          [{' '}
          <Link
            href={'#' + `${kebabCase(fullName)}`}
            className="underline-offset-[0.2rem]"
          >
            {fullName}
          </Link>{' '}
          ]
        </p>
      </div>
    </Transition>
  )
}

export default Update
