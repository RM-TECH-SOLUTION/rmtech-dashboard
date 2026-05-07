import React, { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";

const CreateMainCatalogueForm = ({ onClose, mainCatalogue }) => {

  const token = localStorage.getItem("token");

  const [saving,setSaving] = useState(false);
  const [imageFile,setImageFile] = useState(null);

  const [form,setForm] = useState({
    merchantId: token || "",
    name:"",
    slug:"",
    description:"",
    image:null
  });

  // Prefill form if editing
  useEffect(() => {
    if (mainCatalogue) {
      setForm({
        merchantId: mainCatalogue.merchant_id || token || "",
        name: mainCatalogue.name || "",
        slug: mainCatalogue.slug || "",
        description: mainCatalogue.description || "",
        image: mainCatalogue.image || null
      });
    }
  }, [mainCatalogue, token]);

  /* IMAGE SELECT */

  const handleImageUpload = (file)=>{

    if(!file) return;

    setImageFile(file);

    setForm(prev=>({
      ...prev,
      image:URL.createObjectURL(file)
    }));

  };

  const removeImage = ()=>{
    setImageFile(null);
    setForm(prev=>({...prev,image:null}));
  };

  /* SUBMIT */

  const handleSubmit = async()=>{

    if(!form.name){
      alert(`${mainCatalogue ? 'Update' : 'Create'} main catalogue name required`);
      return;
    }

    setSaving(true);

    try{

      const formData = new FormData();

      formData.append("merchant_id", form.merchantId);
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);

      if (mainCatalogue) {
        formData.append("id", mainCatalogue.id);
      }

      if(imageFile){
        formData.append("image", imageFile);
      }

      const url = mainCatalogue 
        ? "https://api.rmtechsolution.com/updateMainCatalogue"
        : "https://api.rmtechsolution.com/createMainCatalogue";

      const res = await fetch(url, {
        method: "POST",
        body: formData
      });

      const json = await res.json();

      if(!json.success){
        throw new Error(json.message);
      }

      alert(`Main catalogue ${mainCatalogue ? 'updated' : 'created'}`);

      onClose();

    }
    catch(err){
      console.error(err);
      alert(err.message);
    }

    setSaving(false);

  };

  /* DELETE */

  const handleDelete = async () => {

    if (!window.confirm("Are you sure you want to delete this main catalogue?")) return;

    try {

      const formData = new FormData();

      formData.append("id", mainCatalogue.id);

      formData.append("merchant_id", form.merchantId);

      const res = await fetch("https://api.rmtechsolution.com/deleteMainCatalogue", {

        method: "POST",

        body: formData

      });

      const json = await res.json();

      if (!json.success) {

        throw new Error(json.message);

      }

      alert("Main catalogue deleted");

      onClose();

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  return(

    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg overflow-hidden max-h-[95vh] overflow-y-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{mainCatalogue ? 'Update' : 'Create'} Main Catalogue</h2>
          <div className="flex gap-2">
            {mainCatalogue && (
              <button onClick={handleDelete} className="text-red-600" style={{marginRight:20}}>
                <Trash2 size={20}/>
              </button>
            )}
            <button onClick={onClose}>
              <X size={20}/>
            </button>
          </div>
        </div>

        {/* BODY */}

        <div className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Merchant ID
            </label>

            <input
              value={form.merchantId}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Main Catalogue Name *
            </label>

            <input
              value={form.name}
              onChange={(e)=>
                setForm({...form,name:e.target.value})
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Slug
            </label>

            <input
              value={form.slug}
              onChange={(e)=>
                setForm({...form,slug:e.target.value})
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>

            <textarea
              rows={3}
              value={form.description}
              onChange={(e)=>
                setForm({...form,description:e.target.value})
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* IMAGE */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Catalogue Image
            </label>

            {!form.image ? (

              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                onClick={()=>document.getElementById("main-cat-image").click()}
              >

                <Upload className="mx-auto mb-2"/>

                <p className="text-gray-500 text-sm">
                  Click to upload image
                </p>

                <input
                  id="main-cat-image"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e)=>handleImageUpload(e.target.files[0])}
                />

              </div>

            ):(
              <div className="relative w-40">

                <img
                  src={form.image}
                  alt="catalogue"
                  className="h-28 w-full object-cover rounded"
                />

                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <X size={12}/>
                </button>

              </div>
            )}

          </div>

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 px-6 py-4 border-t">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
          >
            {saving ? "Saving..." : `${mainCatalogue ? 'Update' : 'Create'} Main Catalogue`}
          </button>

        </div>

      </div>

    </div>

  );

};

export default CreateMainCatalogueForm;