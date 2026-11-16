
import React, { useEffect, useRef, useState } from 'react';
import image from '../assets/images/image.png';
import { Cropper } from 'react-cropper';
import { Button, Form, Modal } from 'react-bootstrap';

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const cropperRef = useRef(null);

  const [replacementImage, setReplacementImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [userText, setUserText] = useState('');
  const [designation, setDesignation] = useState('');

  const handleReplacementImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setReplacementImage(reader.result);
        setShowCropper(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCropDone = () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas({
      width: 1000,
      height: 1000,
    });

    const croppedDataURL = croppedCanvas.toDataURL('image/jpeg', 1.0);

    setCroppedImage(croppedDataURL);
    setShowCropper(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const originalImg = new Image();

    originalImg.src = image;

    originalImg.onload = () => {
      canvas.width = originalImg.width;
      canvas.height = originalImg.height;

      ctx.drawImage(originalImg, 0, 0);
    };
  }, []);

  // Draw cropped image on canvas
  const getCroppedImgFunc = () => {
    if (!croppedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const croppedImg = new Image();

    croppedImg.onload = () => {
      const x = 143.4;
      const y = 665.3;
      const width = 321.2;
      const height = 321.2;

      ctx.drawImage(croppedImg, x, y, width, height);
    };

    croppedImg.src = croppedImage;
  };

  useEffect(() => {
    if (croppedImage) {
      getCroppedImgFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedImage]);

  // Download final image
  const handleDownload = () => {
    const canvas = canvasRef.current;

    const scaledCanvas = document.createElement('canvas');

    scaledCanvas.width = canvas.width * 2;
    scaledCanvas.height = canvas.height * 2;

    const scaledCtx = scaledCanvas.getContext('2d');

    scaledCtx.scale(2, 2);
    scaledCtx.drawImage(canvas, 0, 0);

    const finalImage = scaledCanvas.toDataURL('image/jpeg', 1.0);

    const link = document.createElement('a');
    link.href = finalImage;
    link.download = 'image.jpg';
    link.click();
  };

  const handleClose = () => {
    setShowCropper(false);
  };

  const handleAddText = () => {
    setShowTextModal(true);
  };

  // Add name and optional designation
  const handleTextSubmit = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const originalImg = new Image();

    originalImg.src = image;

    originalImg.onload = () => {
      // Reset canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImg, 0, 0);

      const drawText = () => {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        const textX = 303;

        // Name
        const nameFontSize = 35;

        ctx.font = `bold ${nameFontSize}px 'Franklin Gothic Demi', Arial, sans-serif`;

        const nameY = designation.trim() ? 1018 : 1033;

        ctx.fillText(userText.trim(), textX, nameY);

        // Designation (optional)
        if (designation.trim()) {
          const designationFontSize = 22;

          ctx.font = `${designationFontSize}px Arial, sans-serif`;
          ctx.fillText(designation.trim(), textX, 1050);
        }
      };

      // Draw cropped image before text
      if (croppedImage) {
        const croppedImg = new Image();

        croppedImg.onload = () => {
          const x = 143.4;
          const y = 665.3;
          const width = 321.2;
          const height = 321.2;

          ctx.drawImage(croppedImg, x, y, width, height);

          drawText();
        };

        croppedImg.src = croppedImage;
      } else {
        drawText();
      }
    };

    setShowTextModal(false);
  };

  return (
    <div style={{ margin: '30px' }}>
      <h2>Image Editor</h2>

      <Button
        onClick={handleAddText}
        variant="primary"
        className="me-2 my-2"
      >
        Add Name
      </Button>

      <input
        type="file"
        accept="image/*"
        onChange={handleReplacementImageUpload}
      />

      {showCropper && (
        <Modal
          style={{ marginTop: '20px', width: '100vw' }}
          show={showCropper}
          onHide={handleClose}
        >
          <Modal.Dialog>
            <Modal.Header closeButton onClick={handleClose}>
              <Modal.Title>Crop Your Image</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Cropper
                src={replacementImage}
                style={{ height: 400, width: '100%' }}
                aspectRatio={1}
                guides={false}
                ref={cropperRef}
                viewMode={1}
              />
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
              >
                Close
              </Button>

              <Button
                variant="primary"
                onClick={handleCropDone}
              >
                Done
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>
      )}

      <div
        style={{
          width: '100%',
          maxWidth: '90vw',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid black',
            marginTop: '10px',
            width: '100%',
            height: 'auto',
          }}
        ></canvas>
      </div>

      <Button
        onClick={handleDownload}
        variant="success"
        disabled={!(userText.trim() && croppedImage)}
      >
        Download Image
      </Button>

      {/* Name and optional designation modal */}
      <Modal
        show={showTextModal}
        onHide={() => setShowTextModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Name</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Enter Name *</Form.Label>

            <Form.Control
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Enter your name"
              maxLength={25}
              required
            />

            <Form.Text muted>
              {userText.length}/25 characters
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label>Designation (Optional)</Form.Label>

            <Form.Control
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Enter your designation"
              maxLength={35}
            />

            <Form.Text muted>
              {designation.length}/35 characters
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowTextModal(false)}
          >
            Close
          </Button>

          <Button
            variant="primary"
            onClick={handleTextSubmit}
            disabled={!userText.trim()}
          >
            Add Name
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageEditor;
