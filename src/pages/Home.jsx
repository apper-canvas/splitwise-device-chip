import MainFeature from '../components/MainFeature';

const Home = () => {
  return (
    <div className="min-h-full bg-surface-50">
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            SplitWise AI
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Smart expense sharing made simple. Track group spending, split costs intelligently, and settle up effortlessly.
          </p>
        </div>
      </div>
      
      <div className="py-8">
        <MainFeature />
      </div>
    </div>
  );
};

export default Home;