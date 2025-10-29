import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { format, parseISO } from 'date-fns';

const columns = [
  {
    field: 'show_name',
    headerName: 'Show Title',
    flex: 2,
    minWidth: 200,
  },
  {
    field: 'venue',
    headerName: 'Venue',
    flex: 1.5,
    minWidth: 150,
  },
  {
    field: 'show_date',
    headerName: 'Date',
    flex: 1,
    minWidth: 120,
    valueFormatter: (params) => {
      // Add a check for params itself, and use a strict check for null/undefined
      if (!params || params.value == null) {
        return 'N/A';
      }
      try {
        // parseISO is strict and will throw an error for invalid formats
        const date = parseISO(params.value);
        // Add a check to see if parseISO returned a valid date
        if (isNaN(date)) {
          return 'Invalid Date';
        }
        return format(date, 'PPP'); // e.g., Jun 1, 2024
      } catch (e) {
        return 'Invalid Date';
      }
    },
  },
  {
    field: 'total_budget',
    headerName: 'Total Budget',
    type: 'number',
    flex: 1,
    minWidth: 120,
    valueFormatter: (params) => {
      // Add a check for params itself
      const value = (params && params.value != null) ? params.value : 0;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    },
  },
];

const ShowDataGrid = ({ shows, onRowClick, loading }) => {
  const rows = shows.map(show => ({ ...show, id: show.id.toString() }));

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        onRowClick={onRowClick}
        disableSelectionOnClick
        loading={loading}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.main',
            color: 'common.white',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
            backgroundColor: 'action.hover',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
        }}
      />
    </Box>
  );
};

export default ShowDataGrid;
