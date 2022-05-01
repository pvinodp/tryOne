import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import MissingPage from './MissingPage';
import EditPost from './EditPost';

import {Route, Switch, useNavigate, Routes} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {format} from 'date-fns';
import api from './api/posts';
import UseWindowSize from './hooks/useWindowSize';
import UseAxiosFetch from './hooks/useAxiosFetch';
import {DataProvider} from './context/DataContext';

function App() {

  const [posts, setPosts] = useState([]);
  const history = useNavigate();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody,setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody,setEditBody] = useState('');
  

  const { width } = UseWindowSize();
  const {data, fetchError, isLoading}= UseAxiosFetch('http://192.168.1.50:3500/postsvalues');
  
  useEffect( () => {

    setPosts(data)
  }, [data])

  useEffect( () => {
      const filteredResults = posts.filter( (post) => 
        ((post.body).toLowerCase()).includes(search.toLowerCase())
        || ((post.title).toLowerCase()).includes(search.toLowerCase()));

      setSearchResults(filteredResults.reverse());
  }, [posts, search])

  const handleDelete = async (id) => {
    try {
    const new_posts = posts.filter(post => post.id !== id)    
    setPosts(new_posts);
    api.delete(`/postsvalues/${id}`)
    history('/');
  }catch (err){
    console.log(`Error : ${err.message}`);
    }  
  }


  return (
    <div className="App">
      <DataProvider>
        <Header 
          title="react tuturial" 
        />
        < Nav
          
        />
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/post" element={<NewPost/>}/>
            <Route exact path="/post/:id" element={<PostPage
                                            posts={posts}
                                            handleDelete={handleDelete}                                          
                                          />}/>
            <Route exact path="/about" element={<About/>}/>
            <Route path="*" element={<MissingPage/>}/>
            <Route exact path="/edit/:id" element={<EditPost/>}/>
        </Routes>
        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;