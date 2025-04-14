import { SavedFeed } from '../../components/saveNews';

function SaveArticalPage(authUser) {
  return (
   
    <main className="min-h-screen bg-gray-50 pt-5 pb-24 mt-20 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Saved News</h2>
          <SavedFeed authUser={authUser}/>
        </section>
      </div>
    </main>
  );
}

export default SaveArticalPage;