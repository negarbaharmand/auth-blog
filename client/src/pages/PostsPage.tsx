import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
  author: { id: number; email: string };
}

const API = "http://localhost:3000";

function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${API}/posts`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Kunde inte hämta inlägg");
          return;
        }

        setPosts(data);
      } catch (err) {
        setError("Något gick fel vid hämtning av inlägg");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div className="p-8">Laddar...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Alla inlägg</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Inga inlägg ännu.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.content}</p>
              <p className="text-sm text-gray-500">
                Författare: {post.author.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostsPage;
