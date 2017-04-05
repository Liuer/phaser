/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Animation = require('./frame/Animation');
var Map = require('../structs/Map');
var Pad = require('../utils/string/Pad');

/**
* Animations are managed by the global AnimationManager. This is a singleton class that is
* responsible for creating and delivering animations and their corresponding data to Game Objects.
*
* Sprites and other Game Objects get the data they need from the AnimationManager.
*
* Access it via `state.anims`.
*
* @class Phaser.AnimationManager
* @constructor
*/
var AnimationManager = function (game)
{
    this.game = game;

    this.textureManager = null;

    this.anims = new Map();
};

AnimationManager.prototype.constructor = AnimationManager;

AnimationManager.prototype = {

    boot: function (textureManager)
    {
        this.textureManager = textureManager;
    },

    //  config format:
    //  {
    //      frames: [
    //          { key: textureKey, frame: textureFrame },
    //          { key: textureKey, frame: textureFrame, duration: float },
    //          { key: textureKey, frame: textureFrame, onUpdate: function }
    //      ],
    //      framerate: integer,
    //      duration: float (seconds, optional, ignored if framerate is set),
    //      skipMissedFrames: boolean,
    //      delay: integer
    //      repeat: -1 = forever, otherwise integer
    //      repeatDelay: integer
    //      yoyo: boolean
    //      hideOnComplete: boolean
    //      onStart: function
    //      onRepeat: function
    //      onComplete: function,
    //      transitions: [
    //          {
    //              key: string <- key of the animation to blend with,
    //              frames: [] <- play these frames before starting key
    //          }
    //      ]
    //  }

    create: function (key, config)
    {
        if (this.anims.has(key))
        {
            console.error('Animation with key', key, 'already exists');
            return;
        }

        var anim = new Animation(this, key, config);

        this.anims.set(key, anim);

        return anim;
    },

    get: function (key)
    {
        return this.anims.get(key);
    },

    //  Load an Animation into a Game Objects Animation Component
    load: function (child, key, startFrame)
    {
        var anim = this.get(key);

        if (anim)
        {
            anim.load(child, startFrame);
        }

        return child;
    },

    generateFrameNumbers: function (key, startFrame, endFrame, firstFrame)
    {
        var out = [];

        if (firstFrame)
        {
            out.push({ key: key, frame: firstFrame });
        }

        for (var i = startFrame; i <= endFrame; i++)
        {
            out.push({ key: key, frame: i });
        }

        return out;
    },

    /**
    * Really handy function for when you are creating arrays of animation data but it's using frame names and not numbers.
    * For example imagine you've got 30 frames named: 'explosion_0001-large' to 'explosion_0030-large'
    * You could use this function to generate those by doing: Phaser.Animation.generateFrameNames('explosion_', 1, 30, '-large', 4);
    *
    * @method Phaser.Animation.generateFrameNames
    * @static
    * @param {string} prefix - The start of the filename. If the filename was 'explosion_0001-large' the prefix would be 'explosion_'.
    * @param {number} start - The number to start sequentially counting from. If your frames are named 'explosion_0001' to 'explosion_0034' the start is 1.
    * @param {number} stop - The number to count to. If your frames are named 'explosion_0001' to 'explosion_0034' the stop value is 34.
    * @param {string} [suffix=''] - The end of the filename. If the filename was 'explosion_0001-large' the prefix would be '-large'.
    * @param {number} [zeroPad=0] - The number of zeros to pad the min and max values with. If your frames are named 'explosion_0001' to 'explosion_0034' then the zeroPad is 4.
    * @return {string[]} An array of framenames.
    */
    generateFrameNames: function (key, prefix, start, stop, suffix, zeroPad)
    {
        if (suffix === undefined) { suffix = ''; }
        if (zeroPad === undefined) { zeroPad = 0; }

        var output = [];
        var diff = (start < stop) ? 1 : -1;

        //  Adjust because we use i !== stop in the for loop
        stop += diff;

        for (var i = start; i !== stop; i += diff)
        {
            var frame = prefix + Pad(i, zeroPad, '0', 1) + suffix;

            output.push({ key: key, frame: frame });
        }

        return output;
    }

};

module.exports = AnimationManager;
