import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

const iniState = {
    url: ''
}

const InputUrl = () => {
    // state for storing user input
    const [input, setInput] = useState(iniState)

    // state for storing all insights from database
    const [urlInfo, setUrlInfo] = useState('')

    // onchange event handler for user input
    const changeHandler = (event) => {
        const { value, name } = event.target
        setInput({ ...input, [name]: value })
    }
    // function for clearing user input value
    const clearHandler = () => {
        if (window.confirm('Are you sure to clear..?')) {
            setInput(iniState)
        }
    }
    // submit event handler
    const submitHandler = async (event) => {
        event.preventDefault()
        await axios.post(`/urls/scrapUrl`, input)
            .then(res => {
                // console.log(res.data);
                toast.success(res.data.msg)
                setInput(iniState)
            }).catch(err => toast.warning(err.message))
    }

    // Initial data fetching handler to get all insights stored in the database
    const iniFetch = async () => {
        await axios.get('/urls/getAll')
            .then(res => {
                // console.log(res.data.data);
                setUrlInfo(res.data.data)
            }).catch(err => console.log(err.message))

    }

    // event handler for updating favorite
    const fevHandler = async (dom_name) => {
        if (window.confirm('Want to add as favorite??')) {
            await axios.put('/urls/addFev', { dom_name })
                .then(res => {
                    // console.log(res.data.msg);
                    toast.success(res.data.msg)
                }).catch(err => toast.warning(err.message))
        }
    }

    // event handler to delete web insights from the database
    const removeHandler = async (id) => {
        if (window.confirm('Want to delete web insights??')) {
            await axios.delete(`/urls/deleteUrl/${id}`)
                .then(res => {
                    // console.log(res.data.msg);
                    toast.success(res.data.msg)
                }).catch(err => toast.warning(err.message))
        }
    }

    useEffect(() => {
        iniFetch()
    }, [urlInfo]);
    return (
        <div className='mx-4 '>
            <h1 className='text-light display-5 fw-semibold mt-5 text-center'>Webpage Scrapper</h1>
            <div className="row my-5">
                <div className="col-md-6 offset-md-3 text-center">
                    <form onSubmit={submitHandler} autoComplete='off'>
                        <div className="inp-group">
                            <input type="url" placeholder='Enter url...' name="url" id="url" className='' value={input.url} onChange={changeHandler} />
                            <i className="bi bi-x-lg clear-icon" type='button' onClick={clearHandler}></i>
                            <input type="submit" value={'Get Insights'} className=' submit-button' />
                        </div>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col-12 ">
                    <h3 className='text-center text-warning mb-3 text-decoration-underline'>URLs Insights List</h3>
                    <table className="table table-bordered ">
                        <thead >
                            <tr className='text-center text-light'>
                                <th scope="col">Domain Name</th>
                                <th scope="col">Word Count</th>
                                <th scope="col">Favorite</th>
                                <th scope="col">Web-Links</th>
                                <th scope="col">Media-Links</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urlInfo && urlInfo.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.domain_name}</td>
                                        <td className='word_count'>
                                            {item.word_count && item.word_count.map((word_count_item, word_count_index) => {
                                                return (
                                                    <span key={word_count_index}>{word_count_item}</span>
                                                )
                                            })}
                                        </td>
                                        <td>{item.favorite}</td>
                                        <td className='web_links'>
                                            {item.web_links && item.web_links.map((web_links_item, web_links_index) => {
                                                return (
                                                    <span key={web_links_index}>{web_links_item}</span>
                                                )
                                            })}
                                        </td>
                                        <td className='media_links'>
                                            {item.media_links && item.media_links.map((media_links_item, media_links_index) => {
                                                return (
                                                    <span key={media_links_index}>{media_links_item}</span>
                                                )
                                            })}
                                        </td>
                                        <td className='action_btns'>
                                            <span type='button' onClick={() => fevHandler(item.domain_name)}><i className="bi bi-bookmark-heart-fill"></i> Add-To-Fav</span>
                                            <span type='button' onClick={() => removeHandler(item._id)}><i className="bi bi-trash-fill"> Remove</i> </span>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div >

    )
}

export default InputUrl