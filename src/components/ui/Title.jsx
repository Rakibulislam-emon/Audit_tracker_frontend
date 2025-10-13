export default function Title({ users, title ,desc,moduleTiles}) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">
       {desc} {users?.length} {moduleTiles}
      </p>
    </>
  );
}
