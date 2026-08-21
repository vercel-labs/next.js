
export default function Home() {
  return <div>
    <p>Please access this page via http://localhost:3000/ or http://127.0.0.1:3000/ on macOS 26.1 and search something in the Chrome developer tools search panel.</p>
    <p>The search hangs forever.</p>
    <p>like this ↓</p> <img src="/screenshot.jpg" alt="Chrome search" width={1000} height={1000} />
    <p>But via IP address (like http://192.168.1.2:3000/), the search will work correctly.</p>
    </div>
}
