#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

/// Advances packed `[x, y, z, vx, vy, vz]` particles in place.
#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn integrate_particles(particles: &mut [f32], dt: f32, damping: f32) {
    let dt = dt.clamp(0.0, 0.1);
    let damping = damping.clamp(0.0, 1.0);
    for particle in particles.chunks_exact_mut(6) {
        particle[4] = (particle[4] - 9.81 * dt) * damping;
        particle[3] *= damping;
        particle[5] *= damping;
        particle[0] += particle[3] * dt;
        particle[1] += particle[4] * dt;
        particle[2] += particle[5] * dt;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn integrates_and_ignores_incomplete_particles() {
        let mut data = [0.0, 1.0, 0.0, 2.0, 0.0, -2.0, 99.0];
        integrate_particles(&mut data, 0.1, 1.0);
        assert_eq!(data[0], 0.2);
        assert!(data[1] < 1.0);
        assert_eq!(data[2], -0.2);
        assert_eq!(data[6], 99.0);
    }
}
