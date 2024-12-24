import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex relative justify-center min-h-screen overflow-hidden">
      {/* Enhanced Moon Effect */}
      <div className="absolute top-[-90%] md:top-[-90%] lg:top-[-70%] xl:top-[-40%] right-[-10%] w-[70rem] h-[70rem]">
        {/* Main Moon Circle - Darker base */}
        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-900"></div>

        {/* Crater Effects */}
        <div className="absolute w-[95%] h-[95%] top-[2.5%] left-[2.5%] rounded-full">
          <div className="absolute w-[20%] h-[20%] top-[20%] left-[30%] rounded-full bg-gray-300 blur-sm opacity-40"></div>
          <div className="absolute w-[15%] h-[15%] top-[50%] left-[60%] rounded-full bg-gray-200 blur-sm opacity-30"></div>
          <div className="absolute w-[25%] h-[25%] top-[30%] left-[45%] rounded-full bg-gray-400 blur-sm opacity-25"></div>
        </div>

        <div className="absolute w-full h-full rounded-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-gray-200 to-transparent opacity-90 blur-3xl"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white via-gray-300 to-transparent opacity-70 blur-2xl"></div>
        </div>
        {/* Subtle Glow Effect */}
        {/* <div className="absolute w-full h-full rounded-full bg-white opacity-90 blur-3xl"></div> */}
        <div className="absolute -inset-4 rounded-full bg-white opacity-10 blur-3xl"></div>
        {/* Realistic Light Reflection */}
        <div className="absolute w-[90%] h-[90%] right-0 top-0 rounded-full bg-gradient-to-l from-zinc-950 via-zinc-900 to-zinc-950 opacity-100"></div>
      </div>

      {/* Stars Effect - Enhanced */}
      {/* <div className="absolute inset-0  bg-[radial-gradient(white_1px,transparent_1px)] opacity-20 bg-[length:20px_20px]"></div> */}

      {/* Content Container */}
      <div className="relative flex flex-col justify-center items-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md space-y-8 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
// function LampDemo() {
//   return (
//     <LampContainer>
//       <motion.h1
//         initial={{ opacity: 0.5, y: 100 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{
//           delay: 0.3,
//           duration: 0.8,
//           ease: "easeInOut",
//         }}
//         className="mt-8 bg-gradient-to-br from-zinc-50 to-zinc-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
//       >
//         Build lamps <br /> the right way
//       </motion.h1>
//     </LampContainer>
//   );
// }

// <div className="absolute top-[-35%] right-[-15%] w-[60rem] h-[60rem] rotate-[-45deg]">
// {/* Main Moon Circle - Using white/gray gradient for realistic moon look */}
// <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-900"></div>

// {/* Crater Effects */}
// <div className="absolute w-[95%] h-[95%] top-[2.5%] left-[2.5%] rounded-full">
//   <div className="absolute w-[20%] h-[20%] top-[20%] left-[30%] rounded-full bg-gray-300 blur-sm opacity-40"></div>
//   <div className="absolute w-[15%] h-[15%] top-[50%] left-[60%] rounded-full bg-gray-200 blur-sm opacity-30"></div>
//   <div className="absolute w-[25%] h-[25%] top-[30%] left-[45%] rounded-full bg-gray-400 blur-sm opacity-25"></div>
// </div>

// {/* Enhanced Glow Effect */}
// <div className="absolute w-full h-full rounded-full">
//   <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-gray-200 to-transparent opacity-90 blur-3xl"></div>
//   <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white via-gray-300 to-transparent opacity-70 blur-2xl"></div>
// </div>

// {/* Atmospheric Glow */}
// <div className="absolute -inset-4 rounded-full bg-white opacity-10 blur-3xl"></div>
// </div>

// {/* Stars Effect - Enhanced with multiple layers */}
// <div className="absolute inset-0">
// <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] opacity-40 bg-[length:16px_16px]"></div>
// <div className="absolute inset-0 bg-[radial-gradient(white_2px,transparent_2px)] opacity-20 bg-[length:48px_48px] animate-twinkle"></div>
// </div>
