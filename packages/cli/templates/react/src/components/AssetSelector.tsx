import { FunctionComponent, useState } from 'react'
import { SelectAsset } from '@storyblok/field-plugin'
import Button from './button/Button'

type AssetSelectorFunc = FunctionComponent<{
  selectAsset: SelectAsset
}>
const AssetSelector: AssetSelectorFunc = ({ selectAsset }) => {
  const [imageUrl, setImageUrl] = useState<string>('')

  const handleSelectAsset = async () => {
    setImageUrl(await selectAsset())
  }

  return (
    <div className="asset-selector">
      <Button onClick={handleSelectAsset}>Select Asset</Button>
      <span>Image Url: {imageUrl}</span>
    </div>
  )
}

export default AssetSelector
