// import Link from 'next/link';

// export function Navbar() {
//   return (
//     <nav className="bg-red-300 text-white p-4 rounded-full mx-2 my-2">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link href="/" className="text-xl font-bold">
//           College Placement Portal
//         </Link>
        
//         <div className="flex gap-4">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>
//           <Link href="/dashboard" className="hover:underline">
//             Dashboard
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-red-300 p-4 rounded-full mx-2 my-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-black" style={{ color: "#000000" }}>
          College Placement Portal
        </Link>
        
        <div className="flex gap-4">
          <Link href="/" className="hover:underline text-black" style={{ color: "#000000" }}>
            Home
          </Link>
          <Link href="/dashboard" className="hover:underline text-black" style={{ color: "#000000" }}>
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}