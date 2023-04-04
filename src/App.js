// routes
import { useEffect } from 'react';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

// ----------------------------------------------------------------------

export default function App() {
    useEffect(() => {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }, []);
    return (
        <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Router />
        </ThemeProvider>
    );
}
// import React from 'react';
// import { Draggable, Droppable } from 'react-drag-and-drop';

// export default function App() {
//     const onDrop = (data) => {
//         console.log(data);
//     };
//     return (
//         <div>
//             <ul>
//                 <Draggable type="test" data="Hello">
//                     <li>Hello</li>
//                 </Draggable>
//                 <Draggable type="drag" data="World">
//                     <li>World</li>
//                 </Draggable>
//                 <Draggable type="test" data="dfas asefd ejkh">
//                     <li>dfas asefd ejkh</li>
//                 </Draggable>
//                 <Draggable type="test" data="dfasd">
//                     <li>dfasd</li>
//                 </Draggable>
//             </ul>
//             <Droppable types={['test']} onDrop={onDrop}>
//                 <ul style={{ height: 400, border: '1px solid red' }}></ul>
//             </Droppable>
//         </div>
//     );
// }
