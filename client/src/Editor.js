import ReactQuill from "react-quill";

export default function Editor({value,onChange}) {
    const editorStyle = {
       
      backgroundColor:'white',
      border: '1px solid #ccc',
      height: '500px',
       
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      lineHeight: '.8px',
      overflow: 'hidden',
    };
    const editorContainerStyle = {
      backgroundColor: 'lightgray',
      padding :'10px' // Set the background color of the padded space
    };
  
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };
  return (
    <div className="content" style={editorContainerStyle} > 
    <ReactQuill
    style={editorStyle}
      value={value}
      theme={'snow'}
      onChange={onChange}
      modules={modules} />
    </div>
  );
}