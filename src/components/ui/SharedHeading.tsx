interface SharedHeadingProps {
  sectionTitle: string
}
const SharedHeading = ({ sectionTitle }: SharedHeadingProps) => {
  return (
    <div className="font-inter w-full">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4">
        <div className="bg-primary-border h-[1px] flex-1" />

        <h2 className="text-primary-text text-[24px] font-semibold whitespace-nowrap md:text-[32px]">{sectionTitle}</h2>

        <div className="bg-primary-border h-[1px] flex-1" />
      </div>
    </div>
  )
}

export default SharedHeading
