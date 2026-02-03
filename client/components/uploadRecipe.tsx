type Props = {
  thumbnail?: File | string | null
  onChange: (file: File) => void
}

export default function RecipeThumbnail({ thumbnail, onChange }: Props) {
  const getImageSrc = () => {
    if (!thumbnail) return null
    if (typeof thumbnail === 'string') return thumbnail
    return URL.createObjectURL(thumbnail)
  }

  const imageSrc = getImageSrc()

  return (
    <label className="thumbnail-box">
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) onChange(e.target.files[0])
        }}
      />
      {imageSrc ? (
        <img src={imageSrc} alt="Recipe thumbnail" />
      ) : (
        <span>Upload recipe photo</span>
      )}
    </label>
  )
}

