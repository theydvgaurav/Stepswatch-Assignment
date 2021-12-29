import React, { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'
import DetailsCard from './components/DetailsCard'

const App = () => {

    const [name, setName] = useState('')
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [moreRecords, setMoreRecords] = useState(false);
    const [data, setData] = useState([])

    const url = `https://openlibrary.org/search.json?q=${name}&page=${page}&limit=20`

    useEffect(() => {
        setLoading(true);

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                setData(data.concat(result.docs))
                setLoading(false);
                if (result.numFound - result.start > 0)
                    setMoreRecords(true)
            })
            .catch(error => setError(error));
    }, [page]);

    useEffect(()=>{
        setData([])
    },[name])


    const Ref = useRef()
    const lastRecordRef = useCallback(item => {
        if (loading)
            return
        if (Ref.current)
            Ref.current.disconnect()

        Ref.current = new IntersectionObserver(intersectionData => {
            if (intersectionData[0].isIntersecting && moreRecords) {
                setPage(lastpage => lastpage + 1)
            }
        })
        if (item) Ref.current.observe(item)
    }, [loading, moreRecords])


    const getData = (event) => {
        event.preventDefault();
        setLoading(true);
        setData([])

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {

                setData(result.docs)
                setLoading(false);

                if (result.numFound - result.start > 0)
                    setMoreRecords(true)
            })
            .catch(error => setError(error));
    }

    const nameChangeHandler = (event) => {
        setName(event.target.value)
        setPage(1)
    }


    return (
        <div className='main' >
            <form onSubmit={getData} >
                <div className='formcontainer'>
                    <input className='input' placeholder='Name of the Book' type='text' onChange={nameChangeHandler} />
                    <button className='button' type='submit' >Get Details</button>
                </div>
            </form>
            <div className='cardContainer'>
                {
                    data.map((itemDetails, index) => {
                        if (data.length === index + 1) {
                            return (
                                <div ref={lastRecordRef} >
                                    <DetailsCard item={itemDetails} />
                                </div>)
                        }

                        else {
                            return (<DetailsCard item={itemDetails} />)
                        }
                    })
                }
            </div>
            <div className="loading" >
                <p style={{ fontSize: 28 }} >
                    {loading && 'Loading...'}
                </p>
            </div>
            <div className="loading" >
                <p style={{ fontSize: 28 }} >
                    {error && 'Error'}
                </p>
            </div>

        </div>
    )
}

export default App