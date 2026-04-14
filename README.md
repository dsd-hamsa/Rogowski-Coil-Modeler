# Rogowski-Coil-Modeler

This is a self-contained browser app for studying how Rogowski coil installation geometry can create current measurement error, then comparing installation methods with Monte Carlo simulation.

## What it models

The app starts with a fast engineering model:

`I_meas = I_true * F_offset * F_tilt * F_shape * F_skew * F_neighbors`

Where:

- `F_offset ~= 1 - k_o (r / R)^2`
- `F_tilt ~= cos(theta)^n`
- `F_shape ~= 1 - k_s (1 - b/a)`
- `F_skew ~= 1 - k_a |skew| / R`
- `F_neighbors` is a simple first-order adjacent-conductor coupling term

This is intended for concept screening and method comparison, not as a final physics claim. The fitted coefficients should be tuned against bench measurements.

## What the app includes

- Deterministic geometry view for one install case
- Side-by-side Monte Carlo comparison for two installation methods
- Editable distributions for offset, tilt, ovality, skew, closure bias, and motion
- Summary metrics including mean error, P95 absolute error, and threshold exceedance rates
- Installation Quality Index `P(|error| < target)`

## Running it

Because the app uses JavaScript modules, serve it from a local web server:

```powershell
cd C:\Dev\Rogowski
python -m http.server 8000
```

Then open:

[http://localhost:8000](http://localhost:8000)

## Suggested workflow

1. Set your reference geometry and fitted coefficients in **Model Settings**.
2. Use **Deterministic Geometry Case** to understand how one placement changes the response.
3. Define distributions for Method A and Method B based on observed field installs.
4. Run Monte Carlo and compare:
  - mean absolute error
  - P95 absolute error
  - fraction of installs above 0.5%, 1%, and 2%
  - Installation Quality Index
5. Calibrate `k_o`, `k_s`, the tilt exponent, and the neighbor term using bench data.

## Calibration ideas

For each installation method, measure a sample of real installs or bench setups and record:

- coil offset from conductor center
- tilt angle
- major and minor loop axes
- axial skew
- adjacent conductor spacing and current
- latch support or hanging behavior

Then tune the model coefficients until simulated and measured error distributions line up reasonably well.

## Next extensions

- Add CSV export of Monte Carlo samples for reporting
- Add saved method libraries for different coil or panel types
- Add a more physics-grounded numerical geometry model
- Add calibration mode that fits coefficients from measured data
