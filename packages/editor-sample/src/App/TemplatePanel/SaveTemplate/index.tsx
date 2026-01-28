import React, { useState, useEffect } from 'react';

import { SaveOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';
import { fetchTemplate, type TemplateListItem } from '../../../api/templates';

import SaveTemplateDialog from './SaveTemplateDialog';

export default function SaveTemplate() {
  const document = useDocument();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingTemplate, setExistingTemplate] = useState<TemplateListItem | null>(null);

  // Check if current template exists in database
  useEffect(() => {
    const checkTemplate = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#template/')) {
        const slug = hash.replace('#template/', '');
        fetchTemplate(slug)
          .then((template) => {
            setExistingTemplate(template);
          })
          .catch(() => {
            setExistingTemplate(null);
          });
      } else {
        setExistingTemplate(null);
      }
    };

    checkTemplate();
    
    // Listen for hash changes
    const handleHashChange = () => {
      checkTemplate();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSaved = () => {
    // Refresh the page or update the hash to reload the template
    const hash = window.location.hash;
    if (hash.startsWith('#template/')) {
      window.location.reload();
    } else if (existingTemplate) {
      window.location.hash = `#template/${existingTemplate.slug}`;
      window.location.reload();
    }
  };

  return (
    <>
      <Tooltip title={existingTemplate ? 'Update Template' : 'Save Template'}>
        <IconButton onClick={() => setDialogOpen(true)}>
          <SaveOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <SaveTemplateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={handleSaved}
        existingTemplate={existingTemplate}
      />
    </>
  );
}
