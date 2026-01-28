type Props = {
  thumbnail?: File | null
  onChange: (file: File) => void
}

export default function RecipeThumbnail({ thumbnail, onChange }: Props) {
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
      {thumbnail ? (
        <img src={URL.createObjectURL(thumbnail)} />
      ) : (
        <span>Upload recipe photo</span>
      )}
    </label>
  )
}

