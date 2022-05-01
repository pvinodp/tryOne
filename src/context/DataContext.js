import {createContext, useState, useEffect} from 'react';

import {useNavigate} from 'react-router-dom';
import {format} from 'date-fns';
import api from '../api/posts';
import UseWindowSize from '../hooks/useWindowSize';
import UseAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});


export const DataProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody,setPostBody] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editBody,setEditBody] = useState('');
    const history = useNavigate();
  
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
    
    const handleEdit = async (id) => {
    
        const dateTimeValue = format(new Date(),'MMMM dd, yyyy pp');
        const updatedPost = {id, title:editTitle, datetime: dateTimeValue, body:editBody};
        try{
          const response = api.put(`/postsvalues/${id}`, updatedPost);
          setPosts(posts.map( post => post.id === id ? { ...response.data} : post))
          setEditBody('')
          setEditTitle('')
          history('/');
        }catch(err){
          console.log(`Error : ${err.message}`);
        }
    }
      
    const handleSubmit = async (e) => {
          e.preventDefault();
          const id = posts.length? posts[posts.length -1].id +1 : 1;
          const dateTimeValue = format(new Date(),'MMMM dd, yyyy pp');
          const newPost = {id, title:postTitle, dateTimeValue, body:postBody};
          try{
            const response  = await api.post('/postsvalues', newPost)
            const allPosts = [ ... posts, response.data]
            setPosts(allPosts);
            setPostTitle('');
            setPostBody('');
            history('/');
          }catch (err){
            console.log(`Error : ${err.message}`);
          }
          
    }

    return (
        <DataContext.Provider value={{
            width, search, setSearch,
            searchResults, fetchError, isLoading,
            handleSubmit, postTitle, setPostTitle, postBody, setPostBody,
            posts, handleEdit, editBody, setEditBody, editTitle, setEditTitle
        }}>
            {children}
            </DataContext.Provider>
    )
}

export default DataContext;