import Link from 'next/link'

import { charaDictionary } from '#data/CharaDictionary'
import { commissionData } from '#data/CommissionData'

// Define the shape of an object needed to store information about the latest update
type LatestEntry = {
  fileName: string
  Character: string
}

// Define a function to convert a string to kebab case
const kebabCase = (str: string) =>
  str
    .toLowerCase() // Convert the whole string into lowercase format
    .replace(/'/g, '') // Remove all apostrophes in the string using regular expression
    .replace(/[\W_]+/g, '-') // Replace all non-word characters with hyphen using regular expression

// Define the Update component which determines the latest updated work and displays that information.
const Update = () => {
  // Initialize a variable to store information about the latest entry in commissionData
  let latestEntry: LatestEntry | null = null

  // Loop through each entry in commissionData, extract publish date information from the filename strings,
  // and compare whether this entry is newer than previous entries. Record the latestEntry information if so.
  for (const [, { fileName, Character }] of Object.entries(commissionData)) {
    // Extract the first 8 characters of the filename to get the publish date information
    const publishDate = fileName.substring(0, 8)

    // Convert the publish date string to a number for comparison purposes
    const publishDateInt = parseInt(publishDate)

    // If the publish date string can't be converted to a number (i.e., NaN), skip this iteration of the loop
    if (isNaN(publishDateInt)) continue

    // If there is no latestEntry or the current file being processed is newer than the latestEntry, update the latestEntry object
    if (!latestEntry || latestEntry.fileName < fileName) {
      latestEntry = { fileName, Character }
    }
  }

  // If there are no entries in commissionData, return a message indicating no updates were found.
  if (!latestEntry) {
    return <p className="font-mono text-sm">No updates found</p>
  }

  // Extract the filename and character information from the latestEntry object, and format the date string.
  const rawDate = latestEntry.fileName.substring(0, 8)
  const formattedDate = `${rawDate.slice(0, 4)}/${rawDate.slice(4, 6)}/${rawDate.slice(6, 8)}`

  // Look up the full name of the character using the charaDictionary object based on their abbreviation.
  // The abbreviation is obtained from the latestEntry object processed in the previous code block.
  const { Character } = latestEntry

  // Find a dictionary entry in charaDictionary whose "Abbr" property matches the current character's abbreviation
  const dictionaryEntry = charaDictionary.find(chara => chara.Abbr === Character)

  // If a dictionary entry was found, set fullName to its "FullName" property. Otherwise, set it to the lowercase version of the abbreviation.
  const fullName = dictionaryEntry ? dictionaryEntry.FullName : Character.toLowerCase()

  // Render the update information in a Transition component that fades in when the component appears.
  return (
    <div className="flex flex-auto font-mono text-sm ss:text-xs">
      <p className="pr-2">Last update:</p>
      <p className="pr-2" suppressHydrationWarning={true}>
        {formattedDate}
      </p>

      {/* Display a link to scroll to the relevant character */}
      <p className="">
        [{' '}
        <Link href={'#' + `${kebabCase(fullName)}`} className="underline-offset-[0.2rem]">
          {fullName}
        </Link>{' '}
        ]
      </p>
    </div>
  )
}

// Export the Update component as the default export of this module
export default Update
