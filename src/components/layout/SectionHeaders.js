export default function SectionHeaders({ header, subHeader }) {
  return (
    <>
      <h3 className="uppercase text-gray-500 font-semibold underline leading-3">
        {subHeader}
      </h3>
      <h2 className="text-primary italic font-bold text-4xl">{header}</h2>
    </>
  );
}
