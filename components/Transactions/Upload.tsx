import { gql } from '@apollo/client'
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'components/Styled';
import { useUploadFileMutation } from 'graphql/generated/codegen';
import { useAlert } from 'components/Alert';
const UPLOAD = gql`
    mutation uploadFile($file: Upload!) {
      uploadFile(file: $file) {
        uri
      }
    }
`
interface UploadZoneProps {
  isDragging: boolean
  message: string
}
const UploadZone = styled.label<UploadZoneProps>`
  border: 2px  ${props => props.isDragging ? 'solid var(--action)' : 'dashed var(--actionHover)'};
  color: ${props => props.isDragging ? ' var(--action)' : ' var(--fontColor)'};
  width: 400px;
  max-width: 90vw;
  height: 100px;
  background-color: ${props => props.isDragging ? 'var(--actionSubtle)' : 'var(--backgroundSubtle)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
const UploadContainer = styled.div`
  max-width: 400px;
  margin: 30px auto;
`

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const { addAlert } = useAlert()
  const [uploadF, { loading }] = useUploadFileMutation({
    onCompleted: (data) => {
      addAlert({ message: "Success!", type: "success" });
      setFile(null);
      setUploadSuccess(true);
    }
  })

  const submitFile = (file: File) => {
    if (file.type === "text/csv") {
      uploadF({ variables: { file } })
    }
  }

  useEffect(() => {
    if (uploadSuccess) {
      setTimeout(() => {
        setUploadSuccess(false)
      }, 4000)
    }
  }, [uploadSuccess])

  return (
    <UploadContainer>
      <UploadZone
        isDragging={isDragging}
        onDragEnter={() => {
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files[0].type === 'text/csv') {
            setFile(e.dataTransfer.files[0])
          }
        }}
        message={isDragging ? 'Upload!' : 'Drop CSV Here'}
      >
        <input type="file" style={{ display: 'none' }} onChange={e => {
          if (e.target.files[0].type === 'text/csv') {
            setFile(e.target.files[0])
          }
        }}></input>
        {file && file.name}
        {!file &&
          <div style={{ textAlign: 'center' }}>
            <p>{isDragging ? 'Upload!' : 'Upload CSV File'}</p>
          </div>
        }
      </UploadZone >
      <Button category="PRIMARY" disabled={!file || loading} loading={loading} style={{ width: '100%', marginTop: '1rem' }} onClick={() => submitFile(file)}>
        Upload
      </Button>
    </ UploadContainer>
  );
};

export default Upload;
