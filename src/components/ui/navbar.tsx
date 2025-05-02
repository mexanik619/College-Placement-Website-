// import Link from 'next/link';

// export function Navbar() {
//   return (
//     <nav className="bg-blue-700 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link href="/" className="text-xl font-bold">
//           Placement Portal
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
    <nav className="bg-red-300 text-white p-4 rounded-full mx-2 my-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          College Placement Portal
        </Link>
        
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}