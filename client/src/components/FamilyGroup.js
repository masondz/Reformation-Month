import React, { useEffect, useState, Fragment } from 'react'
import ReportAdReaderReading from './ReportAdReaderReading'
import JoinFamilyGroup from './JoinFamilyGroup'
import CreateFamilyGroup from './CreateFamilyGroup'
import CreateAdditionalReader from './CreateAdditionalReader'
import DeleteAdReader from './DeleteAdReader'
import AdReaderChallenge from './AdReaderChallenge'
import { toast } from 'react-toastify'


const FamilyGroup = ({ setAuth, reader, displayTotal, setDisplayTotal }) => {
    const [inFamGroup, setInFamGroup] = useState(false)
    const [famGroup, setFamGroup] = useState({})
    const [adReaders, setAdReaders] = useState([
        {
            name: undefined,
            chapters_read: '',
            books_read: '',
            verses_memorized: '',
        },
    ])
    const [checkAdReaders, setCheckAdReaders] = useState(true)

    //get reader's family group
    const getFamilyGroup = async () => {
        try {
            const familyGroup = await fetch('/family-group', {
                method: 'GET',
                headers: { token: localStorage.token },
            })
            if (familyGroup.status === 401) {
                console.log('You are not in a family group')
                setLoading(false)

                return
            }
            console.log(familyGroup)
            const parseRes = await familyGroup.json()
            setFamGroup(parseRes)
            setInFamGroup(true)
            setLoading(false)
            console.log(parseRes)
        } catch (err) {
            console.error(err.message)
        }
    }

    //allow reader to leave family group
    const leaveFG = async () => {
        try {

            let reader_id = reader.id
            let fg_id = famGroup.id
        
            const body = { reader_id, fg_id }
            const request = await fetch('/family-group/remove-reader', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },
                body: JSON.stringify(body),
            })
            let parsRes = await request.json()
            console.log(parsRes)
            // setInFamilyGroup(false);
            window.location = '/'
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getFamilyGroup()
    }, [])

    const primaryReaders = (readers) => {
        let sentence = ''
        for (let i = 0; i < readers.length; i++) {
            if (i === readers.length - 1) {
                sentence += readers[i] + '.'
            } else if (i === readers.length - 2) {
                sentence += readers[i] + ' and '
            } else {
                sentence += readers[i] + ', '
            }
        }
        return sentence
    }

    //Get Additional Readers: ...
    const getAdditionalReader = async () => {
        try {
            const getAdditionalReader = await fetch('/additional-readers', {
                method: 'GET',
                headers: { token: localStorage.token },
            })
            const parseRes = await getAdditionalReader.json()
            setAdReaders(parseRes)
            console.log(parseRes)
        } catch (err) {
            console.error(err.message)
        }
    }
    useEffect(() => {
        getAdditionalReader()
    }, [checkAdReaders]) //might try adding adReaders to dependencies, so that it refreshes with an ad_reader_id?

    // console.log(adReaders);

    const [loading, setLoading] = useState(true)

    return (
        <div className="">
            {loading ? (
                <h4>loading...</h4>
            ) : (
                <div>
                    {!inFamGroup ? (
                        <div className="form-control my-2">
                            <div className="row justify-content-center">
                                <p>
                                    You are not in a family Group yet. Family
                                    Groups allows you to report for readers who
                                    are not able to make reading reports for
                                    themselves (such as children)
                                </p>
                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <JoinFamilyGroup
                                        setAuth={setAuth}
                                        reader={reader}
                                    />
                                    <CreateFamilyGroup
                                        setAuth={setAuth}
                                        reader={reader}
                                        setFamGroup={setFamGroup}
                                        setInFamGroup={setInFamGroup}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Fragment>
                            <div className="family-title">
                                <p>
                                    Family Group:{' '}
                                    <strong>{famGroup.family_name}</strong>
                                </p>
                            </div>
                            <div className="family-group">
                                <p>
                                    Family Group Leaders:{' '}
                                    {primaryReaders(famGroup.primary_readers)}
                                </p>
                                {console.log(adReaders)}
                                {adReaders.map((adReader, index) => (
                                    <div className="family-member">
                                        <h4
                                            key={index}
                                            style={{
                                                backgroundColor:
                                                    'rgba(252, 169, 3, .25)',
                                            }}
                                        >
                                            {adReader.name}:{' '}
                                        </h4>
                                        <Fragment key={index + 1}>
                                            <ReportAdReaderReading
                                                adReader={adReader}
                                                adReaders={adReaders}
                                                setAdReaders={setAdReaders}
                                                displayTotal={displayTotal}
                                                setDisplayTotal={
                                                    setDisplayTotal
                                                }
                                            />{' '}
                                        </Fragment>
                                        <AdReaderChallenge
                                            setAuth={setAuth}
                                            adReader={adReader}
                                        />
                                        <DeleteAdReader
                                            setAuth={setAuth}
                                            adReader={adReader}
                                            setAdReaders={setAdReaders}
                                            adReaders={adReaders}
                                            reader={reader}
                                            setCheckAdReaders={
                                                setCheckAdReaders
                                            }
                                            famGroup={famGroup}
                                        />
                                    </div>
                                ))}
                                <div className="family-options">
                                    <CreateAdditionalReader
                                        setAuth={setAuth}
                                        reader={reader}
                                        adReaders={adReaders}
                                        setAdReaders={setAdReaders}
                                        famGroup={famGroup}
                                        setCheckAdReaders={setCheckAdReaders}
                                        checkAdReaders={checkAdReaders}
                                        leaveFG={leaveFG}
                                    />
                                </div>
                            </div>
                        </Fragment>
                    )}
                </div>
            )}
        </div>
    )
}

export default FamilyGroup
