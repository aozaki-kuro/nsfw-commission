export interface CommissionInfoProps {
  // Extracted directly from Data
  fileName: string
  Character: string
  Twitter: string
  Pixiv: string
  Skeb: string

  // Processed and required in components, not in Commission Data
  Creator: string
  PublishDate: string
}
