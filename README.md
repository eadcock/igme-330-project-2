# igme-330-project-2
Made by Peyton Anderson and Eric Adcock
## Summary
[INSERT CLEVER GAME TITLE HERE] was originally a sound-based stealth game. Many of those elements still exist in the final product. The player must navigate a maze filled with enemies, and every element of the maze reacts to the currently playing music! We have three levels, using songs of various tempos to simulate difficulty levels.

## A. Overall Quality of Experience/Impact
1. The visuals are simple by design. The players gains information in a way akin to echolocation. We want everything to feel clean, simple, and never give the player more information than they need to descern their immediate surroundings. Enemy types can break this theme, but overall we want a simple, clean interface.
1. Boy I hope so
1. It takes everything we did in class and builds upon it in a unique and interesting ways, such as the expanding circle and sound bar walls.
1. Clean, simple, effective B)

## B. User Experience
1. All of our controls will be within canvas to keep a coherent theme. The player will be introduced with a simple start button. 
1. A splash screen will appear telling the player the basic controls. Here the player can select their difficulty. Once the game starts, a help button will forever be in the top right corner if the player needs any additional help. A pause menu will also let the player back out and access additional options such as volume.
1. - [x] Title
   - [x] h1 element
1. Controls
    - [x] Player/pause button
    - [x] Volume slider
    - [x] Fullscreen button
    - [x] Progress indicator
    - [x] 2 additional sliders
    - [x] 3 checkboxes <-- turn on or off living walls
    - [x] 1 radio button group <-- ours will be difficulty selection
    - [x] both frequency and waveform data
    - [x] distort music after taking a point of damage

## Above and Beyond
- Utilization of ctx.globalCompositeOperation to draw below already drawn objects, as well as using a 'xor' like operation to 'cut out' a transparent circle from a black square (which is how we did the vision circle on beat).
- Random Maze Generation
- Fancy classes for our walls that come alive
- Circular sine wave created from wavelength data that follows the circle around


| Criteria | Weight | Your Score |
| -------- | ------ | ---------- |
| **A. [Overall Quality of Experience/Impact](#theme)** | **50** | |
|    1. Does the app have an coherent and identifiable theme? | | Yes |
|    2. Does the app work as intended and it is reasonably engaging (both visually and otherwise)? | | Yes |
|    3. Does the app functionality and programming go beyond what we did in class? | | Definitely |
|    4. Is the app at least *approaching/approximating* "portfolio quality" that you would not hesitate to show a potential employer? | | Yes |
|    **Overall:** Excellent/Outstanding/"Wow" (A+ = 50/50), Very Good (A = 45/50), Good (35-40/50), Fair (25-35/50), Poor (15-25/50), Unacceptable (0-15/50) ||
| &nbsp; | &nbsp; |
| **B. [User Experience](#user-experience)** | **20** | |
|    1. The purpose of the app and how to use it are obvious | Fairly |
|    2. Users should be able to figure out how to use the app with minimal instruction. The app runs without errors | Yes |
|    3. Has required text content | Yes |
|    4. Has required controls. Widgets are well labeled and follow interface conventions | Yes |
|    5. Runs without errors | Yes |
|    6. Visual design is pleasing (or at a minimum, "not ugly") | Yes |
|    - *Missing controls* | *(-5 each)* |
|    - *Errors* | *(-? depending on severity)* |
|    **Overall:** You should aim to score 20/20 in this category ||
| &nbsp; | &nbsp; |
| **C. [Media](#media)**  | **15** | |
|    - *CSS does not pass validation* | *(-5)* | 0 |
|    - *HTML does not pass validation* | *(-5)* | 0 |
|    - *Missing required semantic HTML elements* | *(-5)* | 0 |
|    - *Majority of CSS is not in an external stylesheet* | *(-5)* | 0 |
|    - *Missing an embedded font* | *(-5)* | -5 |
|    - *Images not properly optimized* | *(-5)* | 0 |
|    - *Did not use `canvas.save()` or `canvas.restore()`* | *(-5)* | 0 |
|    - *Did not draw rectangles, arcs, and lines* | *(-10)* | 0 |
|    - *Did not use canvas API* | *0 grade on project* | We did :) |
|    **Overall:** You should aim to score 15/15 in this category ||
| &nbsp; | &nbsp; |
| **D. [Code](#code)**  | **15** | |
|    - *File Naming standards NOT followed (per incident)* | *(-1 to -5)* | 0 |
|    - *Code standards NOT followed (per incident)* | *(-1 to -5)* | 0 |
|    - *Inline event handlers used* | *(-5)* | 0 |
|    - *Missing an index.js (or main.js) file* | *(-10)* | 0 |
|    - *Missing/improperly implemented ES6 Modules* | *(-15)* | 0 |
|    **Overall:** You should aim to score 15/15 in this category || 15/15 |
| &nbsp; | &nbsp; |
| **Total Points Possible** | **100** | 95 |
| &nbsp; | &nbsp; |
| **Other Deductions** | **&darr; Don't lose points for any of these! &darr;** | |
| *Deduction if required prototype is not submitted to dropbox on time* | *(-10)* | |
| *Deduction if final and complete documentation is not submitted to dropbox on time* | *(-10)* | |
| *Deduction if video demo is not submitted to dropbox on time* | *(-10)* | |
| *Deduction if ES6 Module Pattern is not used* | *(-10)* | |
| *-15% late penalty 0-24 hours after due date, -15% 24-48 hours and so on, means a maximum grad of 85% on any project that is submitted late* | *(-??)* | |
