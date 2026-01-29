import { useState, useEffect } from "react";
import "./App.css"

function InputContainer() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [backendOk, setBackend] = useState();
  const [pasteUrl,setPasteUrl]=useState([]);
  const [showPopUp,setPopUp]=useState(false);
  const [value,setValue]=useState("");
  const baseUrl="https://backend-2-6d4a.onrender.com";
  
  const checkHealthConnection = async () => {
    const response = await fetch(`${baseUrl}/api/healthz`);

    setBackend(response.ok);
  };
  useEffect(() => {
    checkHealthConnection();
    const loadPastes = async () => {
      const res = await fetch(`${baseUrl}/api/pastes`);
      if (!res.ok) return;
      const data = await res.json();
      setPasteUrl(data);
    };
    loadPastes();
  }, []);

  const handlePaste = async (e) => {
    e.preventDefault();
    const response = await fetch(`${baseUrl}/api/pastes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl==="" ? null : Number(ttl),
        max_views: views==="" ? null : Number(views),
      }),
    });
    const data=await response.json()


    setPasteUrl([...pasteUrl,{url:data.url,id:data.id}])

    setContent("");
  setTtl("");
  setViews("");
  };

  const handleView= async(id)=>{
    const response=await fetch(`${baseUrl}/p/${id}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    })
    if (!response.ok) {
    setPopUp(true);
    setValue("Page not found");
    return;
    }
    const html=await response.text()
    const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");

const cleanText = doc.body.textContent;
console.log(cleanText);
    setPopUp(true)
    setValue(cleanText)
  }

  const handleJson=async (id)=>{
    const response=await fetch(`${baseUrl}/api/pastes/${id}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    })
    if (!response.ok) {
    setPopUp(true);
    setValue("Page not found");
    return;
    }
    const data=await response.json()
    setPopUp(true)
    setValue(data.content)
  }


  return (
    <div className="container">
      <div>
        <h2>Create Paste</h2>
        <p>Backend: {backendOk ? "Connected" : "Down"}</p>

        <form onSubmit={handlePaste}>
          <textarea className="text-area" rows="5"
            placeholder="Paste content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="number" className="num"
            placeholder="TTL (seconds, empty = unlimited)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />

          <input
            type="number" className="num"
            placeholder="Max views (empty = unlimited)"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />

          <button type="submit">Create</button>
        </form>
      </div>
      <ul>
      {pasteUrl.length>0 && pasteUrl.map((each)=> (
         <li><a href="#" onClick={(e)=>{e.preventDefault();
            handleView(each.id)
         }}>{each.url}</a>
         <button onClick={()=>handleJson(each.id)}>View Json</button>
         </li>
      ))}
      </ul>
      {showPopUp && <div className="fixPopUp">
        <div className="popUpContent">
        <pre>{value}</pre>
        <button onClick={()=>{setPopUp(false)}}>Close</button>
        </div>
        </div>}
    </div>
  );
}

export default InputContainer;
