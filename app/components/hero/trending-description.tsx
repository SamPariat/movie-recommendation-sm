export function TrendingDescription() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 space-x-4'>
      <div className='col-span-1 md:col-span-2 xl:col-span-3'>
        <h1 className='font-bold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8'>
          Trending
        </h1>
        <p className='font-medium text-xl sm:text-3xl lg:text-4xl mb-4'>
          Immerse yourself in the cinematic world with our collection
          of the hottest and highest trending movies. From gripping
          dramas to action-packed blockbusters, our curated selection
          guarantees an unforgettable movie experience. Stay
          up-to-date with the latest releases that are capturing the
          hearts of audiences worldwide.
        </p>
      </div>
      <img
        src='./images/trending-3d.png'
        alt='Trending.png'
        className='object-contain h-96 md:col-span-2 lg:col-span-3 lg:col-start-4'
      />
    </div>
  );
}
